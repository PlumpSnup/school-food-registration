import Image from "next/image";
import Link from "next/link";
import "./home.css";
import { Doodles, HeartIcon, PhoneIcon, SchoolIcon, Twirl, Wave } from "./Decor";
import CountUp from "./ui/CountUp";
import RevealOnScroll from "./ui/RevealOnScroll";
import WaitlistForm from "./WaitlistForm";

const STATS = [
  { value: 16.8, decimals: 2, unit: "AED", label: "A lunch on the weekly plan" },
  { value: 5, label: "Fresh foods in every box" },
  { value: 6, unit: "PM", label: "Order cut-off, the day before" },
  { value: 0, label: "Nuts in the kitchen" },
];

const DAY = [
  { img: "prep", caption: "Cooked fresh every morning", alt: "Rows of fresh lunches packed in containers" },
  { img: "packed", caption: "Packed with care", alt: "Shredded chicken and broccoli in a lunch container" },
  { img: "lunchtime", caption: "Opened at lunchtime", alt: "A child's hands opening a lunchbox at a school table" },
];

const STEPS = [
  { title: "Pick the days", text: "Choose one lunch for 18.90 AED, or the whole week for 84 AED. It takes a minute." },
  { title: "We cook it fresh", text: "A licensed kitchen makes it that morning. Healthy, nut-free and kid-approved." },
  { title: "Delivered to school", text: "Lunch arrives before the break, and you get a “Delivered” message. Sorted." },
];

const FOODS = [
  { name: "Chicken breast", note: "Baked and mildly seasoned", img: "chicken" },
  { name: "Rice", note: "Soft, fluffy white rice", img: "rice" },
  { name: "Carrots", note: "Fresh, crunchy sticks", img: "carrot" },
  { name: "Cucumbers", note: "Crisp mini cucumbers", img: "cucumber" },
  { name: "Water", note: "No sugary drinks", img: "water" },
];

const FEATURES = [
  { icon: PhoneIcon, title: "Order for the week", text: "Pick single days or the whole week in one go." },
  { icon: HeartIcon, title: "Allergies covered", text: "Add allergies once; the kitchen sees them on every order." },
  { icon: SchoolIcon, title: "Track every lunch", text: "Ordered, cooking, delivered, right on your phone." },
  { icon: UndoIcon, title: "Change your mind", text: "Cancel a day until 6 pm the day before." },
];

function UndoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M16 14 8 22l8 8M8 22h20a10 10 0 0 1 0 20h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <main className="home">
        <section className="hero-card">
          <Image src="/photos/hero.webp" alt="" fill priority sizes="100vw" className="hero-photo" />
          <div className="hero-tint" aria-hidden="true" />
          <Doodles className="hero-doodles" />
          <Twirl className="hero-twirl" />
          <Twirl className="hero-twirl hero-twirl-2" />
          <div className="hero-content">
            <p className="kicker rise" style={{ "--d": 0 } as React.CSSProperties}>
              Bee happy · bee healthy
            </p>
            <h1 className="hero-title">
              <span className="rise line" style={{ "--d": 1 } as React.CSSProperties}>
                Lunch, sorted
              </span>
              <span className="rise line" style={{ "--d": 2 } as React.CSSProperties}>
                before the <span className="sticker">bell.</span>
              </span>
            </h1>
            <p className="hero-lead rise" style={{ "--d": 4 } as React.CSSProperties}>
              Busy mornings? Pick your child&apos;s lunches for the week in a minute. We cook them fresh and deliver
              them straight to school in Dubai.
            </p>
            <div className="hero-ctas rise" style={{ "--d": 5 } as React.CSSProperties}>
              <Link href="/order" className="btn btn-arrow">
                Order lunches <span className="arrow">→</span>
              </Link>
              <a href="#how-it-works" className="btn btn-outline">
                How it works
              </a>
            </div>
          </div>
          <a href="#stats" className="scroll-cue" aria-label="Scroll down">
            ↓
          </a>
          <div className="brackets" aria-hidden="true">
            <span>[ Fresh daily ]</span>
            <span>[ Delivered to school ]</span>
          </div>
        </section>

        <section id="stats" className="stats">
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-item reveal" style={{ "--i": i } as React.CSSProperties}>
              <b>
                <CountUp value={s.value} decimals={s.decimals} />
                {s.unit && <small> {s.unit}</small>}
              </b>
              <span>{s.label}</span>
            </div>
          ))}
        </section>

        <section className="about wrap">
          <div className="about-art">
            <p className="kicker kicker-left reveal">{"// About MealBee"}</p>
            <p className="ghost-word" aria-hidden="true">
              Fresh
            </p>
            <div className="about-pic reveal">
              <Image
                src="/photos/meal.webp"
                alt="Rice, shredded chicken and vegetables in a lunch box"
                fill
                sizes="(max-width: 860px) 92vw, 420px"
                className="about-photo"
              />
              <div className="about-icons" aria-hidden="true">
                {FOODS.map((f) => (
                  <Image key={f.img} src={`/food/${f.img}.png`} alt="" width={40} height={40} />
                ))}
              </div>
              <span className="about-cap">Cooked this morning, eaten at lunch</span>
            </div>
          </div>
          <div className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
            <h2 className="about-title">We bee-lieve every child deserves a healthy lunch, even on the busiest mornings</h2>
            <p className="about-text">
              Packing lunch every day is hard. Canteen food isn&apos;t always healthy, and other lunch services cost a
              lot or only work at certain schools.
            </p>
            <p className="about-text">
              MealBee lets you pick one lunch or a whole week from your phone. A licensed kitchen cooks it fresh, and it
              arrives at school ready to eat.
            </p>
            <Link href="/order" className="btn">
              Order lunches →
            </Link>
          </div>
        </section>

        <section id="how-it-works" className="how">
          <div className="blob blob-1" aria-hidden="true" />
          <div className="blob blob-2" aria-hidden="true" />
          <div className="wrap">
            <p className="kicker reveal">The routine</p>
            <h2 className="section-title reveal">How it works</h2>
            <ol className="how-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="how-step reveal" style={{ "--i": i } as React.CSSProperties}>
                  <span className="how-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="day-strip" aria-labelledby="day-title">
          <div className="wrap">
            <p className="kicker reveal">A day with MealBee</p>
            <h2 id="day-title" className="section-title reveal">From our kitchen to their table</h2>
            <ul className="strip">
              {DAY.map((d, i) => (
                <li key={d.img} className="strip-item reveal" style={{ "--i": i } as React.CSSProperties}>
                  <div className="strip-photo">
                    <Image src={`/photos/${d.img}.webp`} alt={d.alt} fill sizes="(max-width: 860px) 92vw, 340px" />
                  </div>
                  <span className="strip-cap">{d.caption}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="lunchbox" className="lunchbox-section">
          <div className="wrap">
            <p className="kicker reveal">On the menu</p>
            <h2 className="section-title reveal">What&apos;s in the lunchbox</h2>
            <p className="section-lead reveal">Our first meal is simple, filling and made for kids.</p>
            <ul className="lunchbox reveal">
              {FOODS.map((f) => (
                <li key={f.img} className="food">
                  <Image src={`/food/${f.img}.png`} alt="" width={80} height={80} className="food-img" />
                  <h3>{f.name}</h3>
                  <p>{f.note}</p>
                </li>
              ))}
            </ul>
            <div className="price-pills reveal">
              <span className="price-pill">
                <b>18.90 AED</b> a single lunch
              </span>
              <span className="price-pill price-pill-dark">
                <b>84 AED</b> a whole week
              </span>
            </div>
            <p className="fine-print">Prices include 5% VAT.</p>
          </div>
        </section>

        <section className="features">
          <Wave />
          <div className="wrap">
            <p className="kicker reveal">For busy parents</p>
            <h2 className="section-title reveal">Everything you need</h2>
            <ul className="feature-grid">
              {FEATURES.map((f, i) => (
                <li key={f.title} className="feature reveal" style={{ "--i": i } as React.CSSProperties}>
                  <span className="feature-icon">
                    <f.icon />
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="join" className="join">
          <Wave />
          <Twirl className="join-twirl" />
          <div className="wrap join-inner">
            <div className="join-copy reveal">
              <p className="kicker">Not ready to order yet?</p>
              <h2 className="section-title">Join the waitlist</h2>
              <p>
                Be the first to know when MealBee starts at your child&apos;s school. Joining is free and doesn&apos;t
                commit you to anything.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>

        <section className="wrap">
          <div className="closing reveal">
            <Image src="/photos/containers.webp" alt="" fill sizes="(max-width: 1040px) 100vw, 1000px" className="closing-photo" />
            <div className="closing-text">
              <h2>Bee happy, bee healthy.</h2>
              <p>Order your child&apos;s first week of lunches today.</p>
            </div>
            <Link href="/order" className="btn closing-btn">
              Order lunches →
            </Link>
          </div>
        </section>
      </main>
      <RevealOnScroll />

      <footer className="footer">
        <Wave />
        <div className="wrap">
          <p className="footer-name">
            Meal<span className="y">Bee</span>
          </p>
          <p>
            Your privacy: we only use your details to tell you about MealBee&apos;s launch. We never sell or share
            them, and you can ask us to delete them at any time.
          </p>
          <p>
            Questions? Email us at{" "}
            <a href="mailto:alyaadam1213@gmail.com" className="footer-link">
              alyaadam1213@gmail.com
            </a>
          </p>
          <p>
            © {new Date().getFullYear()} MealBee · A student project from Dubai · Photos from{" "}
            <a href="https://www.pexels.com" className="footer-link" target="_blank" rel="noopener noreferrer">
              Pexels
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
