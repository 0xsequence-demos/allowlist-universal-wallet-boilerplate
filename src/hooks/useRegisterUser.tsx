import { useAccount, useSignMessage } from "wagmi";
import {
  AUDIENCE_ID,
  useIsAudienceContactRegistered,
  useRegisterAudienceContact,
} from "./useAudience";
import { ExtendedConnector, useSignInEmail } from "@0xsequence/kit";
import { useToast } from "@0xsequence/design-system";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useRegisterUser = () => {
  const { signMessageAsync } = useSignMessage();
  const { address, chainId, connector } = useAccount();
  const { mutateAsync: isAudienceContactRegistered } =
    useIsAudienceContactRegistered();
  const { mutateAsync: registerAudienceContact } = useRegisterAudienceContact();
  const email = useSignInEmail();
  const toast = useToast();
  const queryClient = useQueryClient();
  const isSocialConnector =
    (connector as ExtendedConnector)?._wallet?.type === "social" ||
    connector?.id === "sequence";

  return useQuery({
    queryKey: ["registerUser", address, email],
    queryFn: async () => {
      if (!address || !chainId || (!email && isSocialConnector)) {
        return { isRegistered: false };
      }

      try {
        const registered = await isAudienceContactRegistered(address);

        if (!registered) {
          const message = "wallet with address " + address;
          const response = await signMessageAsync({
            message: message,
          });

          const proof = {
            address: address,
            message: message,
            signature: response,
            chainId: chainId,
          };

          if (!proof || !proof.signature) {
            return { isRegistered: false };
          }

          await registerAudienceContact({
            contact: {
              address: address,
              email: email!,
              audienceId: AUDIENCE_ID,
            },
            walletProof: proof,
          });

          toast({
            title: "User registered",
            description: "User registered successfully",
            variant: "success",
          });

          queryClient.invalidateQueries({ queryKey: ["audienceStatus"] });
        }

        return { isRegistered: true };
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Error registering user",
          variant: "error",
        });
        return { isRegistered: false };
      }
    },
    enabled: Boolean(address) && (Boolean(email) || !isSocialConnector),
  });
};
