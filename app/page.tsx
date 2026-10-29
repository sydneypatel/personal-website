import { SiteHeader } from "@/components/SiteHeader";
import { Story } from "@/components/story/Story";
import { Contact, FlightLog, Postcards } from "@/components/sections/Sections";

export default function Home() {
  return (
    <>
      <SiteHeader page="home" />
      <main id="main">
        <Story />
        <Postcards />
        <FlightLog />
        <Contact />
      </main>
    </>
  );
}
