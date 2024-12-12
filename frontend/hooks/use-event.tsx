import { useEffect } from "react";

export function useEvent(event: string, on: (...args: any[]) => void) {
	useEffect(() => {

		const listener = (...args: any[]) => {
			on(...args);
		};

		if (window.socket != null) {
			console.log("hey socket is not null so listener is ready now!");
			window.socket.on(event, listener);
		} else {
		  document.addEventListener("socket is ready", () => {
			console.log("hey socket is ready so you know now!");
			window.socket.on(event, listener);
		  });
		}


		return () => {
			window.socket.off(event, listener);
		};
		// eslint-disable-next-line
	}, []);
}
