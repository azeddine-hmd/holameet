import { useMediaQuery } from "react-responsive";
import resolveConfig from "tailwindcss/resolveConfig";
import { Config, ScreensConfig } from "tailwindcss/types/config";
import tailwindConfig from "../tailwind.config"; // Your tailwind config

const fullConfig = resolveConfig(tailwindConfig as unknown as Config);

const breakpoints = fullConfig?.theme?.screens;

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
	const bool = useMediaQuery({
		query: `(min-width: ${breakpoints[breakpointKey]})`,
	});
	const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1);
	type Key = `is${Capitalize<K>}`;
	return {
		[`is${capitalizedKey}`]: bool,
	} as Record<Key, boolean>;
}
