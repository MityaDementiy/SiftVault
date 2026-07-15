import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { registerUser, loginUser, logoutUser } from './api';
import { AUTH_ME_QUERY_KEY } from './queries';
import type { AuthUser } from './types';

const HOME_PATH = '/';

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, user);
      navigate({ to: HOME_PATH });
    },
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, user);
      navigate({ to: HOME_PATH });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
    },
  });
};
