import type { ReactNode } from "react";
import { Container, Section, SectionHeader } from "@/components/section";
import type { Cta } from "@/components/ui/cta";

type LegalSection = { title: string; body: ReactNode };

export function LegalPage({
  id,
  title,
  description,
  cta,
  sections,
}: {
  id: string;
  title: string;
  description: string;
  cta: Cta | ReactNode;
  sections: LegalSection[];
}) {
  return (
    <Section labelledBy={id} className="pt-10 md:pt-16">
      <Container className="grid gap-12">
        <SectionHeader as="h1" id={id} label="Legal" title={title} description={description} cta={cta} />
        <div className="grid max-w-[72ch] gap-10">
          {sections.map((section, index) => (
            <section key={section.title} aria-labelledby={`${id}-s${index}`} className="grid gap-3">
              <h2 id={`${id}-s${index}`} className="type-title text-ink">
                {section.title}
              </h2>
              <div className="grid gap-3 leading-relaxed text-ink-soft [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
