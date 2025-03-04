import * as $path from "node:path";
import { getEnv, debug, spawn, mv } from "./utils.js";


// Replace with @webassemblyjs/wasm-opt ?
export async function run({ dir, input, output, extraArgs, verbose }) {
    const isWindows = (process.platform === "win32");

    // Needed to make wasm-opt work on Windows
    const bin = getEnv("WASM_OPT_BIN", (isWindows ? "wasm-opt.cmd" : "wasm-opt"));

    const args = [input, "--output", output].concat(extraArgs);

    if (verbose) {
        debug(`Running ${bin} ${args.join(" ")}`);
    }

    try {
        await spawn(bin, args, { cwd: dir, shell: isWindows, stdio: "inherit" });

    } catch (e) {
        return e;
    }

    await mv($path.join(dir, output), $path.join(dir, input));

    return null;
}
