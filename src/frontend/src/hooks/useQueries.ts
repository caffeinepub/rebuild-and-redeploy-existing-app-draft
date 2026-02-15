import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Member, Product, ExternalBlob } from '../backend';

export function useMemberData() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Member | null>({
    queryKey: ['member', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      const principal = identity.getPrincipal();
      return actor.getMember(principal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useRegisterMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.registerMember(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', identity?.getPrincipal().toString()] });
    },
  });
}

export function useUpdateAvatar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (avatar: ExternalBlob) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateAvatar(avatar);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', identity?.getPrincipal().toString()] });
    },
  });
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePurchaseProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.purchaseProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', identity?.getPrincipal().toString()] });
    },
  });
}
