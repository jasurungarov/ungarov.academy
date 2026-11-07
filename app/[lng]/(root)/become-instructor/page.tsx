import TopBar from "@/components/shared/top-bar";
import { Metadata } from "next";
import Image from "next/image";
import InstructorForm from "./_components/instructor-form";

export const metadata: Metadata = {
  title: "Ungarov Academy | Muallim boʻlish",
  description:
    "Ungarov Academy – platformasida muallim boʻlish uchun ariza qoldiring. Oʻzingizga mos kursni tuzing va oʻrganishni boshlang!",
};

function Page() {
  return (
    <>
      <TopBar
        label="becomeInstructor"
        description="becomeInstructorDescription"
      />

      <div className="mx-auto mt-12 min-h-[50vh] max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Image
            src={"/assets/instructor.png"}
            alt="Instructor"
            width={530}
            height={530}
            className="self-center justify-self-end"
          />
          <InstructorForm />
        </div>
      </div>
    </>
  );
}

export default Page;
