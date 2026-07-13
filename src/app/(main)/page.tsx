import { Hero }            from "@/components/home/Hero";
import { Categories }       from "@/components/home/Categories";
import { HowItWorks }       from "@/components/home/HowItWorks";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { ForVendorsCTA }    from "@/components/home/ForVendorsCTA";
import { Stats }            from "@/components/home/Stats";
import { Testimonials }     from "@/components/home/Testimonials";
import { FAQ }              from "@/components/home/FAQ";
import { Newsletter }       from "@/components/home/Newsletter";

export const metadata = {
  title: "ServiceHub — Book Local Services Instantly",
  description: "Find trusted home cleaning, plumbing, electrical, and 20+ service categories. Vendors set their schedules — you pick a time.",
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <HowItWorks />
      <FeaturedServices />
      <ForVendorsCTA />
      <Stats />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </main>
  );
}
