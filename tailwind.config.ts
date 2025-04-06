import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

const config: Config = {
    darkMode: 'class',
    content: [
    "./content/posts/**/*.mdx",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			white: '#fdfdfd',
  			mamba: '#7B747C',
  			gray: {
  				'50': 'hsl(0, 6%, 97%)',
  				'100': 'hsl(0, 10%, 93%)',
  				'200': 'hsl(350, 11%, 85%)',
  				'300': 'hsl(356, 11%, 74%)',
  				'400': 'hsl(355, 12%, 60%)',
  				'500': 'hsl(354, 12%, 48%)',
  				'600': 'hsl(355, 12%, 39%)',
  				'700': 'hsl(355, 12%, 32%)',
  				'800': 'hsl(0, 10%, 27%)',
  				'900': 'hsl(353, 10%, 24%)',
  				'950': 'hsl(0, 14%, 8%)'
  			},
  			red: {
  				'50': 'hsl(0, 86%, 97%)',
  				'100': 'hsl(0, 93%, 94%)',
  				'200': 'hsl(0, 94%, 89%)',
  				'300': 'hsl(0, 91%, 82%)',
  				'400': 'hsl(0, 87%, 71%)',
  				'500': 'hsl(0, 82%, 60%)',
  				'600': 'hsl(0, 69%, 51%)',
  				'700': 'hsl(0, 72%, 42%)',
  				'800': 'hsl(0, 68%, 37%)',
  				'900': 'hsl(0, 61%, 31%)',
  				'950': 'hsl(0, 72%, 15%)'
  			},
  			yellow: {
  				'50': 'hsl(39, 100%, 96%)',
  				'100': 'hsl(39, 100%, 92%)',
  				'200': 'hsl(39, 100%, 83%)',
  				'300': 'hsl(38, 100%, 72%)',
  				'400': 'hsl(33, 99%, 61%)',
  				'500': 'hsl(29, 98%, 53%)',
  				'600': 'hsl(26, 93%, 48%)',
  				'700': 'hsl(21, 92%, 40%)',
  				'800': 'hsl(18, 78%, 34%)',
  				'900': 'hsl(17, 77%, 28%)',
  				'950': 'hsl(14, 84%, 14%)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-reddit-sans)'
  			],
  			mono: [
  				'var(--font-reddit-mono)'
  			],
  			display: [
  				'var(--font-reddit-sans-condensed)'
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        ".layout-sm": {
          "grid-template-columns": `1fr min(${theme("screens.sm")},100%) 1fr`,
        },
        ".layout-xl": {
          "grid-template-columns": `1fr minmax(auto,${theme(
            "spacing.60"
          )}) min(${theme("screens.sm")},100%) minmax(auto,${theme(
            "spacing.60"
          )}) 1fr`,
        },
      });
    }),
    typography,
    animate,
  ],
};
export default config;