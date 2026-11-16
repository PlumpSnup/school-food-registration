import Image from "next/image";
import { MEAL } from "@/lib/demo-prices";

export default function MealCard() {
  return (
    <div className="card meal-card">
      <div className="meal-foods" aria-hidden="true">
        {MEAL.foods.map((f) => (
          <Image key={f} src={`/food/${f}.png`} alt="" width={40} height={40} />
        ))}
      </div>
      <div>
        <h2 className="meal-name">{MEAL.name}</h2>
        <p className="meal-desc">{MEAL.description}</p>
      </div>
    </div>
  );
}
