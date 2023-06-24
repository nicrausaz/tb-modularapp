import { GitHubIcon, WebIcon } from '@/assets/icons'

export default function About() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center h-screen">
      <div className="max-w-md p-6 rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <img src="/assets/logo.svg" alt="Logo" className="w-16 h-16 mr-2" />
          <h1 className="text-4xl font-bold text-gray-800">Modular App</h1>
        </div>
        <p className="text-lg text-gray-700 mb-4">
          Modular app allows you to create integrations between devices and your favorite services. You can import
          customizable modules to create your own integrations.
        </p>
        <p className="text-lg text-gray-700 mb-4">Version : 1.0.0</p>
        <div className="flex justify-center">
          <a href="https://github.com/votre-utilisateur" target="_blank" className="btn btn-primary mr-2">
            <GitHubIcon className="w-6 h-6 mr-2" />
            GitHub
          </a>
          <a href="https://www.votre-site-web.com" target="_blank" className="btn btn-primary">
            <WebIcon className="w-6 h-6 mr-2" />
            Website
          </a>
        </div>
      </div>
    </div>
  )
}
