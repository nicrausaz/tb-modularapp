import { GitHubIcon, WebIcon } from '@/assets/icons'
import IconButton from '@/components/IconButton'

export default function About() {
  return (
    <div className="bg-gradient-to-r from-primary to-accent flex items-center justify-center h-screen">
      <div className="max-w-md p-6 rounded-xl bg-base-100 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <img src="/assets/logo.svg" alt="Logo" className="w-16 h-16 mr-2" />
          <h1 className="text-4xl font-bold text-gray-800">Modular App</h1>
        </div>
        <p className="text-lg mb-4">
          Modular app allows you to create integrations between devices and your favorite services. You can import
          customizable modules to create your own integrations.
        </p>
        <p className="text-lg mb-4">Version : 1.0.0</p>
        <div className="flex justify-center gap-2">
          <IconButton
            icon={<GitHubIcon className="w-6 h-6" />}
            asLink={true}
            to="https://github.com/nicrausaz/tb-modularapp/"
            target="_blank"
            label="GitHub"
            position="left"
            className="btn-primary"
          />

          <IconButton
            icon={<WebIcon className="w-6 h-6" />}
            asLink={true}
            to="https://example.com"
            target="_blank"
            label="Website"
            position="left"
            className="btn-primary"
          />
        </div>
      </div>
    </div>
  )
}
