import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useI18n } from '../i18n';

export const AuthButtons: React.FC = () => {
  const { t } = useI18n();

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-sm font-medium text-gray-600 hover:text-black px-3 py-1.5 rounded-lg hover:bg-gray-100">
            {t('auth.signIn')}
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
      </SignedIn>
    </>
  );
};
