import CreateGroupForm from "@/components/group/CreateGroupForm";

export default function NewGroupPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-10">
      <p className="text-3xl">✨</p>
      <h1 className="font-heading mt-2 text-3xl text-[var(--ink)]">
        우리만의 모임을 만들어보세요
      </h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        1분이면 충분해요. 만들고 나면 초대 링크가 바로 생겨요.
      </p>

      <div className="mt-8">
        <CreateGroupForm />
      </div>
    </main>
  );
}
