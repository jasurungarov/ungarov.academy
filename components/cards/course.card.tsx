import { ICourse } from "@/app.types";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import CustomImage from '../shared/custom-image'

function CourseCard(course: ICourse) {
  return (
    <Link href={`/course/${course._id}`}>
      <Card className="liquid-glass group w-full">
        <CardContent className="relative h-56 w-full">
          <CustomImage src={course.previewImage} alt={course.title} />
        </CardContent>
        <div className="my-4 flex flex-col space-y-2 px-2">
          <h2 className="line-clamp-1 font-space-grotesk text-xl font-bold sm:text-2xl">
            {course.title}
          </h2>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className='relative size-[25px] sm:size-[40px]'>
								<CustomImage
									src={course.instructor.picture}
									alt={course.instructor.fullName}
									className='rounded-full'
								/>
							</div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {course.instructor.fullName}
              </p>
            </div>

            <div className="flex gap-2">
              <div className="self-start font-space-grotesk text-[8px] text-muted-foreground line-through">
                {course.oldPrice.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
              <div className="font-space-grotesk text-xs font-bold sm:text-sm">
                {course.currentPrice.toLocaleString("en-US", {
                  currency: "USD",
                  style: "currency",
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default CourseCard;
