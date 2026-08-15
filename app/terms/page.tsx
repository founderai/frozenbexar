import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rental Terms & Conditions",
  description: "Frozen Bexar rental terms and conditions. Please read before accepting delivery of rental equipment.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-10">
        <Link href="/" className="text-[#e81ccd] text-sm font-semibold hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-black text-white mb-3">
          Frozen Bexar{" "}
          <span style={{ background: "linear-gradient(135deg,#e81ccd,#ff6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Rental Terms &amp; Conditions
          </span>
        </h1>
        <div className="card-dark rounded-2xl p-5 border border-[#e81ccd]/30 mt-6">
          <p className="text-gray-300 leading-relaxed">
            By accepting delivery or taking possession of rental equipment from Frozen Bexar, the customer agrees to follow the equipment rules and conditions below. These requirements are intended to protect the customer, guests, property, and rental equipment.
          </p>
          <p className="text-[#e81ccd] font-semibold mt-3 text-sm">
            Failure to follow these rules may result in the customer being held responsible for damage, repair, cleaning, or replacement costs.
          </p>
        </div>
      </div>

      <div className="space-y-10 text-gray-300">

        {/* General Rental Rules */}
        <section>
          <h2 className="text-xl font-black text-white mb-4 pb-2 border-b border-[#e81ccd]/20">General Rental Rules</h2>
          <ul className="space-y-2 list-none">
            {[
              "Rental equipment must be used only for its intended purpose.",
              "Customers are responsible for the equipment while it is in their possession.",
              "Equipment should not be moved after Frozen Bexar has delivered and/or set it up unless specifically permitted below.",
              "Children must be supervised around rental equipment.",
              "Do not modify, disassemble, relocate, or attempt to repair Frozen Bexar equipment.",
              "If there is a problem with any equipment, please contact Frozen Bexar rather than attempting to repair or modify it yourself.",
              "The customer may be responsible for damage caused by misuse, negligence, unauthorized movement, failure to follow these instructions, or intentional damage.",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="text-[#00e64d] mt-1 shrink-0">•</span>
                {rule}
              </li>
            ))}
          </ul>
        </section>

        {/* Canopies */}
        <section>
          <h2 className="text-xl font-black text-white mb-4 pb-2 border-b border-[#e81ccd]/20">Canopies</h2>
          <ol className="space-y-3 list-none">
            {[
              "DO NOT MOVE THE CANOPY after it has been set up without prior consent from the owners of Frozen Bexar.",
              "Do not remove, relocate, or alter stakes, weights, tie-downs, anchors, or other components used to secure the canopy.",
              "If weather conditions become unsafe or you have concerns about the canopy, contact Frozen Bexar.",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="text-[#e81ccd] font-black shrink-0 w-5">{i + 1}.</span>
                {rule}
              </li>
            ))}
          </ol>
          <div className="mt-4 bg-[#e81ccd]/10 border border-[#e81ccd]/30 rounded-xl p-4">
            <p className="text-sm text-[#e81ccd] font-semibold">Important:</p>
            <p className="text-sm mt-1">Unauthorized movement of a canopy may cause damage to the canopy, surrounding property, or persons nearby.</p>
          </div>
        </section>

        {/* Margarita Machines */}
        <section>
          <h2 className="text-xl font-black text-white mb-4 pb-2 border-b border-[#e81ccd]/20">Margarita Machines</h2>
          <ol className="space-y-3 list-none">
            {[
              "Margarita machines must remain under a permanent structure at all times. NO EXCEPTIONS.",
              "A canopy, tent, umbrella, or other temporary covering does not qualify as a permanent structure.",
              "DO NOT MOVE THE MARGARITA MACHINE without prior consent from the owners of Frozen Bexar.",
              "Keep the machine protected from rain, direct exposure to weather, and other sources of water.",
              "Do not tilt, relocate, unplug, disassemble, or modify the machine unless instructed by Frozen Bexar.",
              "If the machine is not operating correctly, contact Frozen Bexar before attempting to troubleshoot or repair it.",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="text-[#e81ccd] font-black shrink-0 w-5">{i + 1}.</span>
                {rule}
              </li>
            ))}
          </ol>
          <div className="mt-4 bg-[#e81ccd]/10 border border-[#e81ccd]/30 rounded-xl p-4">
            <p className="text-sm text-[#e81ccd] font-semibold">Important:</p>
            <p className="text-sm mt-1">The customer may be responsible for damage resulting from moving the machine or exposing it to weather or water.</p>
          </div>
        </section>

        {/* Evaporative Fans */}
        <section>
          <h2 className="text-xl font-black text-white mb-4 pb-2 border-b border-[#e81ccd]/20">Evaporative Fans</h2>
          <ol className="space-y-3 list-none">
            {[
              "Never move an evaporative fan while it contains water.",
              "If a fan needs to be relocated, the water must first be drained from the unit.",
              "If manually filling an evaporative fan, water must be added approximately every two (2) hours, or as necessary to maintain an adequate water level.",
              "If the fan runs out of water, TURN OFF THE WATER PUMP. The fan itself may continue to operate, but the water pump should not be allowed to run dry.",
              "Running the water pump without adequate water may damage or burn out the pump.",
              "Customers may be responsible for damage caused by moving a fan while full of water or allowing the water pump to operate without water.",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="text-[#00e64d] font-black shrink-0 w-5">{i + 1}.</span>
                {rule}
              </li>
            ))}
          </ol>
        </section>

        {/* Chairs */}
        <section>
          <h2 className="text-xl font-black text-white mb-4 pb-2 border-b border-[#e81ccd]/20">Chairs</h2>
          <ol className="space-y-3 list-none">
            {[
              "Smoking is permitted around the rental chairs; however, customers are responsible for preventing cigarette, cigar, or other smoking-related burns or damage to chair pads and upholstery.",
              "Do not place lit cigarettes, cigars, smoking materials, hot objects, or open flames directly on the chairs or chair pads.",
              "The customer may be responsible for cleaning, repair, or replacement costs for chairs or pads damaged by burns, stains, excessive soiling, or misuse.",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="text-[#e81ccd] font-black shrink-0 w-5">{i + 1}.</span>
                {rule}
              </li>
            ))}
          </ol>
        </section>

        {/* Damage & Customer Responsibility */}
        <section>
          <h2 className="text-xl font-black text-white mb-4 pb-2 border-b border-[#e81ccd]/20">Damage &amp; Customer Responsibility</h2>
          <p className="text-sm leading-relaxed mb-4">
            The customer is responsible for taking reasonable care of all Frozen Bexar rental equipment during the rental period.
          </p>
          <p className="text-sm leading-relaxed mb-3">The customer may be charged for reasonable cleaning, repair, or replacement costs resulting from:</p>
          <ul className="space-y-2 list-none mb-4">
            {[
              "Unauthorized movement or relocation of equipment",
              "Failure to follow equipment-specific instructions",
              "Negligence or misuse",
              "Burns, stains, or other preventable damage",
              "Damage caused by allowing equipment to operate improperly",
              "Tampering with, modifying, or attempting to repair equipment",
              "Loss or theft of rental equipment",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="text-[#e81ccd] mt-1 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-400 italic">Normal wear and tear from proper use is excluded.</p>
        </section>

        {/* Weather & Safety */}
        <section>
          <h2 className="text-xl font-black text-white mb-4 pb-2 border-b border-[#e81ccd]/20">Weather &amp; Safety</h2>
          <p className="text-sm leading-relaxed mb-3">
            Outdoor rental equipment may be affected by wind, rain, storms, or other weather conditions. Customers should not attempt to relocate, modify, or re-secure equipment in a manner inconsistent with Frozen Bexar&apos;s instructions.
          </p>
          <p className="text-sm leading-relaxed">
            If conditions appear unsafe, stop using the affected equipment and contact Frozen Bexar.
          </p>
        </section>

        {/* Customer Acknowledgment */}
        <section>
          <div className="card-dark rounded-2xl p-6 border border-[#00e64d]/30">
            <h2 className="text-xl font-black text-white mb-4">Customer Acknowledgment</h2>
            <p className="text-sm leading-relaxed mb-3">
              By accepting Frozen Bexar rental equipment, the customer acknowledges that they have received, read, and agree to follow these Rental Terms &amp; Conditions and equipment rules.
            </p>
            <p className="text-sm leading-relaxed mb-4">
              The customer agrees to notify other persons using the rental equipment of any applicable safety and operating requirements.
            </p>
            <div className="bg-[#00e64d]/10 border border-[#00e64d]/30 rounded-xl p-4">
              <p className="text-sm text-[#00e64d] font-semibold">
                Questions or problems with your rental?
              </p>
              <p className="text-sm mt-1">
                Contact Frozen Bexar before moving, modifying, or attempting to repair any equipment.{" "}
                <a href="tel:+12103132474" className="text-[#00e64d] underline">(210) 313-2474</a>
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/quote"
            className="inline-block px-8 py-3 rounded-full font-bold uppercase tracking-wide text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
          >
            Ready to Book? →
          </Link>
        </div>

      </div>
    </div>
  );
}
