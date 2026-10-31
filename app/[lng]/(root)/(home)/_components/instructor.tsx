"use client";

import { IUser } from "@/app.types";
import InstructorCard from "@/components/cards/instructor.card";
import { Button } from "@/components/ui/button";
import useTranslate from "@/hooks/use-translate";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

interface Props {
  instructors: IUser[];
}
function Instructor({ instructors }: Props) {
  const t = useTranslate();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-space-grotesk text-2xl font-bold sm:text-3xl">
        {t("learnInstructors")}
      </h1>

      <div className="mt-2 flex items-center justify-between">
        <p className="min-w-0 flex-1 text-xs text-muted-foreground sm:text-sm">
          {t("learnInstructorsDescription")}
        </p>

        <Button
          variant={"secondary"}
          asChild
          className="shrink-0 self-end max-sm:h-8 max-sm:px-3 max-sm:text-xs">
          <Link href={"/instructors"}>
            <span>{t("viewAll")}</span>
            <MoveUpRight className="ml-2 size-5 max-sm:ml-1 max-sm:size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {instructors.map((item) => (
          <InstructorCard key={item._id} instructor={item} />
        ))}
      </div>

      <div className="mt-6 text-center text-xs sm:text-sm">
        {t("becomeInstructor1")}{" "}
        <Link
          href={"/become-instructor"}
          className="text-green-400 underline hover:text-green-600">
          {t("becomeInstructor2")}
        </Link>
      </div>
    </div>
  );
}

export default Instructor;
