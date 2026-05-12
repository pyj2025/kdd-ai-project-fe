"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDisplayName, type AuthState } from "@/app/actions/auth";
import { toast } from "sonner";

const initial: AuthState = {};

function UpdateNameForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, pending] = useActionState(
    updateDisplayName,
    initial
  );
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (state?.message) toast.success(state.message);
    if (state?.error) toast.error(state.error);
  }, [state?.message, state?.error]);

  const dirty = name.trim() !== defaultName;

  return (
    <form action={formAction} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={pending || !dirty || name.trim().length === 0}
        className="bg-[#0d1f35] hover:bg-[#162d4a] text-white w-fit"
      >
        {pending ? "Saving..." : "Update name"}
      </Button>
    </form>
  );
}

export default UpdateNameForm;
