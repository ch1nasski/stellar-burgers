export type ProfileMenuUIProps = {
  pathname: string;
  handleLogout: () => void | Promise<void>;
  error: string | null;
};
