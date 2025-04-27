import { useSelector } from "react-redux";

interface User {
  email: string | null;
  token: string | null;
  id: string | null;
  role: string | null;
  name: string | null;
}

interface RootState {
  user: User;
}

export function useAuth() {
  const { email, token, id, role, name } = useSelector(
    (state: RootState) => state.user
  );

  return {
    isAuth: !!email && !!token,
    email,
    token,
    id,
    role,
    name,
  };
}
