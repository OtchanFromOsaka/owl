import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";

export default jsxRenderer(({ children, title }) => {
	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="description"
					content="Codename: Owl - Discover fascinating bird nest videos from around the world"
				/>
				<meta name="theme-color" content="#4a6741" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
					rel="stylesheet"
				/>
				<Link href="/app/style.css" rel="stylesheet" />
				<Script src="/app/client.ts" async />
				{title && <title>{title}</title>}
			</head>
			<body class="bg-light">
				<main>{children}</main>
				<footer class="bg-primary text-white py-8 mt-8">
					<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<p>Codename: Owl &copy; {new Date().getFullYear()}</p>
						<p class="text-sm mt-2">
							A project showcasing bird nest videos from around the world
						</p>
					</div>
				</footer>
			</body>
		</html>
	);
});
