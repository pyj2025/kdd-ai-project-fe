"use client";

import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";

function APIConnectionButton() {
  const handleClick = async () => {
    const health = await apiGet("/health");
    console.log("health = ", health);
  };

  return <Button onClick={handleClick}>Check API Connection</Button>;
}

export default APIConnectionButton;
