import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export function useAuth() {
  const user = useSelector((state: any) => state.auth.user);
  const isLoading = useSelector((state: any) => state.auth.isLoading);
  return { user, isLoading };
}