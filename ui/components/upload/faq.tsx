import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>How do I enable Geotagging on my iPhone</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <ol className="list-decimal list-inside">
            <li>Open Settings</li>
            <li>Go to your iPhone’s home screen and tap on Settings.</li>
            <li>Scroll down and tap on Privacy & Security <br/>
            (On iOS 16 and above, it’s called Privacy & Security.)</li>

            <li>Tap on Location Services</li>
            <li>Make sure Location Services is ON</li>
            <li>If it's off, toggle it on.</li>

            <li>Scroll down to find Camera <br/>
            (Or search for "Camera" in the Settings search bar.)</li>

            <li>Tap on Camera</li>

            <li>Set Allow Location Access to "While Using the App" or "Ask Next Time"</li>
            <li>This allows the Camera app to embed location data into photos.</li>
          </ol>

          <p>Here is a video tutorial for the same: <a href="https://www.youtube.com/watch?v=7UpRjdNv_GU" target="_blank">Watch Video</a></p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I enable Geotagging on my Android phone</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <ol className="list-decimal list-inside">
            <li>Open the Camera app</li>
            <li>Go to Camera Settings <br/>
            Usually, there’s a gear ⚙️ icon somewhere in the Camera app — top corner or menu.</li>
            <li>Look for Location Tags / Save Location / Geo-tagging <br/>
            The option may be called: <br/>
            Location Tags (Samsung) <br/>
            Save Location (Pixel) <br/>
            Geo-tagging (others) <br/>
            </li>
            <li>Turn it ON</li>
          </ol>

          <p>Here is a video tutorial for the same: <a href="https://www.youtube.com/watch?v=Sw8P7PY1QSI" target="_blank">Watch Video</a></p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Who runs this platform?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            This platform is run by volunteers from the {process.env.NEXT_PUBLIC_CITY_NAME} community. <br/>
            We are a group of people who are passionate about the city and want to make it a better place. <br/>
            We are not affiliated with any government or organization. <br/>
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
