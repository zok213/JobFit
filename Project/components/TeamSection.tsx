"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight, Github, Linkedin, Twitter, Users } from "lucide-react";
import Image from "next/image";

export const TeamSection = () => {
  const teamMembers = [
    {
      name: "Huỳnh Ngọc Hân",
      role: "Project Manager",
      bio: "Experienced project manager with expertise in leading cross-functional teams and delivering complex software projects on time and within budget.",
      image: "/img/team/huynhngochan.jpg",
      initials: "HNH",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      },
    },
    {
      name: "Nguyễn Bắc Bảo Khang",
      role: "Game Developer",
      bio: "Creative game developer with a passion for building immersive experiences and a strong background in Unity and game mechanics.",
      image: "/img/team/nguyenbacbaokhang.jpg",
      initials: "NBBK",
      social: {
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Nguyễn Xuân Việt",
      role: "AI/ML Engineer",
      bio: "Machine learning expert focused on natural language processing and neural networks with experience implementing AI solutions at scale.",
      image: "/img/team/nguyenxuanviet.jpg",
      initials: "NXV",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      },
    },
    {
      name: "Nguyễn Lê Khánh An",
      role: "Tech Lead",
      bio: "Passionate tech lead with a strong background in software architecture and team leadership, specializing in React and Node.js applications.",
      image: "/img/team/nguyenlekhanhan.jpg",
      initials: "NLKA",
      social: {
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Mai Phước Minh Tài",
      role: "MLOps Engineer",
      bio: "Skilled MLOps engineer with experience building and deploying machine learning pipelines and infrastructure at scale.",
      image: "/img/team/maiphuocminhtai.jpg",
      initials: "MPMT",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      },
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      id="team"
      className="px-6 md:px-12 lg:px-24 py-20 max-w-[1440px] mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-center max-w-2xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Badge className="bg-purple-100 text-purple-800 mb-3">
          OUR EXPERTS
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Meet Our Team
        </h2>
        <p className="text-base md:text-lg text-gray-600">
          Our talented team of professionals brings together expertise in AI,
          development, and recruitment to create the perfect job matching
          platform.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.initials}
            variants={itemVariants}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="p-6">
              <div className="flex items-center gap-5 mb-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-lime-300 to-lime-400">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black text-xl font-bold">
                      {member.initials}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-lime-600 font-medium">{member.role}</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6">{member.bio}</p>

              <div className="flex items-center gap-3">
                {member.social.linkedin && (
                  <Link
                    href={member.social.linkedin}
                    className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <Linkedin className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                  </Link>
                )}
                {member.social.github && (
                  <Link
                    href={member.social.github}
                    className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Github className="h-4 w-4 text-gray-600 hover:text-gray-900" />
                  </Link>
                )}
                {member.social.twitter && (
                  <Link
                    href={member.social.twitter}
                    className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <Twitter className="h-4 w-4 text-gray-600 hover:text-blue-500" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Link href="/careers">
          <Button className="bg-lime-500 hover:bg-lime-600 text-white font-medium px-6 py-2.5 shadow-md hover:shadow-xl transition-all">
            Join our team
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </motion.section>
  );
};
