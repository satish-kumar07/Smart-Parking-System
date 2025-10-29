import smartparking from "../assets/smartparking.mp4";

const DemoVideo = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <div className="max-w-4xl h-full mx-auto my-12 rounded-lg" id="demovideo">
        <div className="mb-12 text-center">
          <h1
            className="text-4xl md:text-[54px] md:leading-[1.1] text-black dark:text-white mb-6"
            style={{
              fontFamily: "Libre Caslon Text, serif",
              fontWeight: "700",
            }}
          >
            Smart Parking Demo Video
          </h1>
          <p
            className="text-base md:text-lg text-[#646461] dark:text-[#B0B0B0] max-w-[60ch] mx-auto"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            A demonstration video showcasing the Smart Parking system in action.
          </p>
        </div>
        <video
          src={smartparking}
          muted
          autoPlay
          loop
          className="w-full h-auto rounded-lg shadow-lg fade-card"
        ></video>
      </div>
    </>
  );
};
export default DemoVideo;
