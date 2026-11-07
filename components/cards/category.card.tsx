import { ICategory } from "@/types";
import Image from "next/image";

function CategoryCard(category: ICategory) {
  return (
    <div>
      <div className="glass flex h-44 w-full items-center justify-center rounded-md">
        <Image
          src={category.icon}
          alt={category.label}
          width={110}
          height={110}
        />
      </div>
      <h2 className="mt-2 line-clamp-1 font-space-grotesk text-base sm:text-lg">
        {category.label}
      </h2>
    </div>
  );
}

export default CategoryCard;
