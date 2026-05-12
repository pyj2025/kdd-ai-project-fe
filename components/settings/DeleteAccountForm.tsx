"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAccount, type AuthState } from "@/app/actions/auth";
import { toast } from "sonner";

const initial: AuthState = {};

function DeleteAccountForm() {
  const [open, setOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [state, formAction, pending] = useActionState(deleteAccount, initial);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  const handleCancel = () => {
    setOpen(false);
    setConfirmValue("");
  };

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 w-fit"
      >
        Delete account
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      className="grid gap-3 border border-red-200 rounded-md p-4 bg-red-50/30"
    >
      <p className="text-sm text-red-700">
        Your account and all decision records will be permanently deleted. This
        cannot be undone.
      </p>
      <div className="grid gap-2">
        <Label htmlFor="confirm">
          Type <span className="font-mono font-bold">DELETE</span> to confirm
        </Label>
        <Input
          id="confirm"
          name="confirm"
          type="text"
          autoComplete="off"
          value={confirmValue}
          onChange={(e) => setConfirmValue(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={pending || confirmValue !== "DELETE"}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {pending ? "Deleting..." : "Permanently delete"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default DeleteAccountForm;
