import ReflectionDetailClient from "@/components/dashboard/reflections/ReflectionDetailClient";

type Props = { params: Promise<{ id: string }> };

async function Page({ params }: Props) {
  const { id } = await params;
  return <ReflectionDetailClient id={id} />;
}

export default Page;
