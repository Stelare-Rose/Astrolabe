{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";
	};

	outputs = { self, nixpkgs }@inputs:
	let
		system = "x86_64-linux";
		
		pkgs = import inputs.nixpkgs{
			inherit system;
			config.allowUnfree = true;
		};
	in 
	{
		devShells.${system}.default = pkgs.mkShell rec {
			name="Astrolabe";
			packages = with pkgs; [
				bun
        svelte-language-server
        astro-language-server
				];
			shellHook = "tmux -L Astrolabe new-session -A -s Astrolabe";
			};
		};
	}
