import { useUser } from '@clerk/clerk-react';
import { LoginButton } from './AuthButtons';

export default function Protected({ children }) {
	const { isSignedIn, isLoaded } = useUser();

	if (!isLoaded) return <p className="p-4 text-sm">Loading…</p>;

	if (!isSignedIn) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
				<p className="text-gray-600">Please sign in to access this content.</p>
				<LoginButton />
			</div>
		);
	}

	return children;
}
