import Image from "next/image";
import WaitlistForm from "./WaitlistForm";

const STEPS = [
  {
    title: "Pick a lunch",
    text: "Choose a fresh, healthy meal for your child in the app. One day or the whole week.",
  },
  {
    title: "Cooked fresh",
    text: "A licensed kitchen prepares it that morning. Healthy, nut-free and kid-approved.",
  },
  {
    title: "Delivered to school",
    text: "Lunch arrives at school, ready to eat. No packing, no 7am panic.",
  },
];

const MEAL = [
  { name: "Chicken breast", note: "Baked and mildly seasoned", color: "chicken" },
  { name: "Rice", note: "Soft, fluffy white rice", color: "rice" },
  { name: "Carrots", note: "Fresh, crunchy sticks", color: "carrot" },
  { name: "Cucumbers", note: "Crisp mini cucumbers", color: "cucumber" },
  { name: "Water", note: "A small bottle, no sugary drinks", color: "water" },
];

export default function Home() {
  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <span className="topbar-name">
            Meal<span className="y">Bee</span>
          </span>
          <a href="#join" className="btn btn-small">
            Join the waitlist
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-inner">
            <Image
              src="/logo.png"
              alt="MealBee logo"
              width={519}
              height={447}
              priority
              className="hero-logo"
            />
            <h1>Healthy school lunches, delivered to school.</h1>
            <p className="tagline">Bee happy, bee healthy.</p>
            <p className="lead">
              We bee-lieve in better lunches. MealBee lets busy parents order fresh, healthy meals that are
              delivered straight to their child&apos;s school. We&apos;re launching soon in Dubai.
            </p>
            <a href="#join" className="btn">
              Join the waitlist
            </a>
          </div>
        </section>

        <section className="how" aria-labelledby="how-title">
          <div className="wrap">
            <h2 id="how-title">How it works</h2>
            <ol className="steps">
              {STEPS.map((step, i) => (
                <li key={step.title} className="step">
                  <span className="step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="meal" aria-labelledby="meal-title">
          <div className="wrap">
            <h2 id="meal-title">What&apos;s in the lunchbox</h2>
            <p className="section-lead">Our first meal is simple, filling and made for kids.</p>
            <ul className="lunchbox">
              {MEAL.map((item) => (
                <li key={item.name} className={`food food-${item.color}`}>
                  <span className="food-dot" aria-hidden="true" />
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="prices" aria-labelledby="prices-title">
          <div className="wrap">
            <h2 id="prices-title">Simple prices</h2>
            <div className="price-grid">
              <div className="price-card">
                <h3>Single meal</h3>
                <p className="price">
                  18.90 <span>AED</span>
                </p>
                <p className="price-sub">per lunch</p>
                <p>Order just the days you need.</p>
              </div>
              <div className="price-card featured">
                <span className="badge">Best value</span>
                <h3>Weekly plan</h3>
                <p className="price">
                  84 <span>AED</span>
                </p>
                <p className="price-sub">per week, 5 lunches (16.80 AED each)</p>
                <p>A healthy lunch every school day, sorted.</p>
              </div>
            </div>
            <p className="fine-print">Prices include 5% VAT. Launch prices may change before we go live.</p>
          </div>
        </section>

        <section id="join" className="join" aria-labelledby="join-title">
          <div className="wrap join-inner">
            <div className="join-copy">
              <h2 id="join-title">Join the waitlist</h2>
              <p>
                Be the first to know when MealBee starts at your child&apos;s school. Joining is free and doesn&apos;t
                commit you to anything.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-name">
            Meal<span className="y">Bee</span>
          </p>
          <p>
            Your privacy: we only use your details to tell you about MealBee&apos;s launch. We never sell or share
            them, and you can ask us to delete them at any time.
          </p>
          <p>© {new Date().getFullYear()} MealBee · A student project from Dubai</p>
        </div>
      </footer>
    </>
  );
}
