import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';

export function LoginButton() {
  return (
    <SignInButton mode="modal">
      <button className="px-3 py-2 rounded border hover:bg-neutral-50" title="Log in">
        Log in
      </button>
    </SignInButton>
  );
}

export function LogoutButton() {
  return (
    <SignOutButton>
      <button className="px-3 py-2 rounded border hover:bg-neutral-50">
        Log out
      </button>
    </SignOutButton>
  );
}

export function UserBadge() {
  const { user, isSignedIn } = useUser();
  if (!isSignedIn) return null;
  return (
    <span className="text-xs opacity-80">
      👤 {user?.fullName || user?.emailAddresses?.[0]?.emailAddress || 'Signed in'}
    </span>
  );
}
