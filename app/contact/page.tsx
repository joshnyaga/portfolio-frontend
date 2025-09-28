
'use client';

import { useState } from 'react';
import { contactService } from '@/services/contactService';
import { Github, Linkedin, Mail, Zap, Send, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PortfolioLayout from '@/components/layout/PortfolioLayout';

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await contactService.create(contactForm);
      toast.success("Message sent successfully!", {
        icon: "🚀",
        style: {
          borderRadius: "8px",
          background: "#1f2937",
          color: "#fff",
        },
      });
      setContactForm({ name: "", email: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortfolioLayout>
      <section className="py-20 pt-32">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let's Build Something Amazing
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let's collaborate and create
              something extraordinary together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fadeInUp">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-blue-400">
                  Send me a message
                </h2>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-gray-700"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-gray-700"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      required
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-gray-700 resize-none"
                      placeholder="Tell me about your project, timeline, and goals..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="animate-fadeInUp animation-delay-300">
              <div className="space-y-8">
                {/* Contact Details */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 text-blue-400">
                    Get in touch
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center">
                      <Mail className="h-6 w-6 text-blue-400 mr-4" />
                      <div>
                        <h3 className="font-semibold text-white">Email</h3>
                        <a
                          href="mailto:your.email@example.com"
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                         joshuakithinjinyaga@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-6 w-6 text-blue-400 mr-4" />
                      <div>
                        <h3 className="font-semibold text-white">Location</h3>
                        <p className="text-gray-400">
                          Available for remote work
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-blue-400 mr-4" />
                      <div>
                        <h3 className="font-semibold text-white">
                          Response Time
                        </h3>
                        <p className="text-gray-400">Usually within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 text-blue-400">
                    Connect with me
                  </h2>

                  <div className="grid gap-4">
                    <a
                      href="https://github.com/joshnyaga"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-blue-500/50 group"
                    >
                      <Github className="h-6 w-6 text-gray-400 group-hover:text-blue-400 mr-4 transition-colors" />
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          GitHub
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Check out my repositories
                        </p>
                      </div>
                    </a>

                    <a
                      href="https://www.linkedin.com/in/joshua-kithinji-b75a96221"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-blue-500/50 group"
                    >
                      <Linkedin className="h-6 w-6 text-gray-400 group-hover:text-blue-400 mr-4 transition-colors" />
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          LinkedIn
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Let's connect professionally
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Quick Response */}
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
                  <div className="flex items-center mb-4">
                    <Zap className="h-6 w-6 text-yellow-400 mr-3" />
                    <h3 className="text-lg font-semibold text-white">
                      Quick Response
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Need a quick consultation or have an urgent project? Email
                    me directly for priority response within a few hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </PortfolioLayout>
  );
}