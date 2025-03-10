import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-blue-900">
      <motion.h1
        className="text-white text-6xl md:text-8xl font-bold text-center leading-tight"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.05, textShadow: "0px 0px 15px rgba(255,255,255,0.8)" }}
      >
        Welcome to <br /> Maharayatara's Page
      </motion.h1>
    </div>
  );
};

export default Home;