import React from 'react';
import {
  SiReact,
  SiNextdotjs,
  SiPython,
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiTensorflow,
  SiTailwindcss,
  SiFirebase,
  SiOpenai,
  SiGithub,
  SiLinkedin,
  SiInstagram,
} from 'react-icons/si';
import { PiChartLineUpBold, PiBrainFill, PiGraduationCapFill, PiCloud } from 'react-icons/pi';
import { IoAnalyticsSharp } from 'react-icons/io5';
import { MdDataThresholding, MdMail, MdLocationOn } from 'react-icons/md';

const PortfolioSkillsFooter = () => {
  const skills = [
    { name: 'React.js', icon: SiReact },
    { name: 'Next.js', icon: SiNextdotjs },
    { name: 'Python', icon: SiPython },
    { name: 'Node.js', icon: SiNodedotjs },
    { name: 'MongoDB', icon: SiMongodb },
    { name: 'PostgreSQL', icon: SiPostgresql },
    { name: 'TensorFlow', icon: SiTensorflow },
    { name: 'Data Analytics', icon: IoAnalyticsSharp },
    { name: 'Full Stack Development', icon: PiGraduationCapFill },
    { name: 'Machine Learning', icon: PiBrainFill },
    { name: 'Artificial Intelligence', icon: PiBrainFill },
    { name: 'Data Visualization', icon: PiChartLineUpBold },
    { name: 'Cloud Computing', icon: PiCloud },
    { name: 'Tailwind CSS', icon: SiTailwindcss },
    { name: 'Firebase', icon: SiFirebase },
    { name: 'OpenAI API', icon: SiOpenai },
  ];

  const quickLinks = ['Home', 'About', 'Education','Certifications', 'Experience', 'Skills'];

  const socialLinks = [
    { icon: SiGithub, url: 'https://github.com', label: 'GitHub' },
    { icon: SiLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: SiInstagram, url: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Skills &{' '}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Expertise in modern technologies and frameworks for building scalable solutions
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <div
                  key={index}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-lg hover:border-purple-300 transition-all duration-300 cursor-pointer"
                >
                  <div className="mb-4 p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full group-hover:from-purple-200 group-hover:to-purple-100 transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-center font-semibold text-gray-800 text-sm md:text-base group-hover:text-purple-600 transition-colors duration-300">
                    {skill.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Build Something Amazing Together
          </h3>
          <p className="text-purple-100 mb-8 text-lg">
            Open to internships, freelance projects, collaborations and exciting opportunities in
            Artificial Intelligence, Full Stack Development and Data Analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="#contact"
              className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-colors duration-300"
            >
              Contact Me
            </a>
            <a
              href="#github"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-600 transition-colors duration-300"
            >
              GitHub Profile
            </a>
          </div>
          <div className="space-y-3">
            <p className="flex items-center justify-center gap-2 text-purple-100">
              <MdMail className="w-5 h-5" />
              ssk461262@gmail.com
            </p>
            <p className="flex items-center justify-center gap-2 text-purple-100">
              <MdLocationOn className="w-5 h-5" />
              Guntur, Andhra Pradesh, India
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Profile Section */}
            <div>
              <h4 className="text-2xl font-bold text-white mb-2">
                Shaik <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Subhani</span>
              </h4>
              <p className="text-purple-400 font-semibold mb-4">
                AI Engineer • Full Stack Developer • Data Analyst
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Passionate about Artificial Intelligence, Full Stack Development, Data Analytics,
                and building impactful software solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-lg font-bold text-white mb-6">Quick Links</h5>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h5 className="text-lg font-bold text-white mb-6">Social Links</h5>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      aria-label={social.label}
                      className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-300"
                    >
                      <SocialIcon className="w-6 h-6 text-gray-300 hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400 text-sm">
              © 2024 Shaik Subhani. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioSkillsFooter;
