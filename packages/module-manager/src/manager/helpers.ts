import { PathLike, existsSync, lstatSync, watch } from 'fs'
import path from 'path'

const dirWatcher = async (dir: PathLike) =>
  watch(dir, async (eventType, filename) => {
    // Ensure the file still exists on the filesystem
    if (!existsSync(path.join(dir.toString(), filename))) return

    // Only watch for folders
    if (!lstatSync(path.join(dir.toString(), filename))?.isDirectory()) return

    //  {recursive: true },
    console.log(eventType, filename)
    if (eventType === 'change') {
      // On change, reload the module
      console.log('change', filename)
    }

    if (eventType === 'rename') {
      // Rename = create or delete
      console.log('rename', filename)
      // On rename, unbind the module
      // If it still exists, rebind it
    }

    // // Get the module.ts file from dir
    // const modulePath = path.join(dir.toString(), '79345338-614b-42a3-a596-170ebccd1989', 'index.js')
    // console.log(modulePath)

    // const { default: mod } = await import(modulePath)

    // console.log(mod.test())
  })

export { dirWatcher }
