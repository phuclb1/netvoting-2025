"use client";

import { forwardRef } from "react";
import { Button, ButtonProps } from "../ui/button";
import { signOut } from "next-auth/react";

export const LogoutButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function LogoutButton() {
    return (
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Sign out
      </Button>
    );
  }
);
