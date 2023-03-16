// import { Manager, Module } from '@ncrausaz/tb-modapp-module-system'
// import { PathLike, readFile, readFileSync, readdir, readdirSync, watch } from 'fs'
// import path from 'path'

// const dirModules = path.join(__dirname, '../..', 'modules')

// const readModuleConfiguration = (modulePath: string) => {
//   // todo
//   const jsonConfig = readFileSync(path.join(modulePath, 'config.json'), 'utf8')
  
//   console.log(jsonConfig)

//   return {
//     name: 'test',
//     description: 'test',
//     version: '1.0.0'
//   }
// }

// const loadModulesFromDirectory = (dir: PathLike) => {
//   const modules = readdirSync(dir)
//   console.log(modules)

//   // A folder represents a module
//   modules.forEach((module) => {
//     const config = readModuleConfiguration(path.join(dir.toString(), module))
//     // Manager.getInstance().registerModule(module, {
//     //   name: config.name,
//     //   description: config.description,
//     //   version: config.version,
//     //   enabled: false,
      
//     // })
//   })
// }

// const dirWatcher = async (dir: PathLike) =>
//   watch(dir, async (eventType, filename) => {
//     //  {recursive: true },
//     console.log(eventType, filename)
//     if (eventType === 'change') {
//       // On change, reload the module
//       console.log('change', filename)
//     }
//     if (eventType === 'rename') {
//       // Rename = create or delete
//       console.log('rename', filename)
//       // On rename, unbind the module
//       // If it still exists, rebind it
//     }

//     // // Get the module.ts file from dir
//     // const modulePath = path.join(dir.toString(), '79345338-614b-42a3-a596-170ebccd1989', 'index.js')
//     // console.log(modulePath)

//     // const { default: mod } = await import(modulePath)

//     // console.log(mod.test())
//   })

// export { dirWatcher, loadModulesFromDirectory }

// // Manager.getInstance().
