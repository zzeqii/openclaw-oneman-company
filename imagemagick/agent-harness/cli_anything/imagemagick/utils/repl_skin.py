"""
REPL unified interface for CLI-Anything
Based on CLI-Anything's repl_skin.py standard
"""
import click
import sys
from typing import Callable, Any

def print_banner(name: str, software: str):
    """Print a nice REPL banner"""
    width = 50
    click.echo()
    click.secho("╔" + "═" * (width - 2) + "╗", fg="blue")
    click.secho(f"║{name:^{width-2}}║", fg="blue")
    click.secho(f"║  {software} for AI Agents  {'':^{width-16}}║", fg="blue")
    click.secho("╚" + "═" * (width - 2) + "╝", fg="blue")
    click.echo()
    click.echo("Type 'help' to see commands, 'exit' to quit.")
    click.echo()

def run_repl(main: Callable[..., Any], cli_name: str, software: str):
    """Run the REPL"""
    print_banner(cli_name, software)
    
    while True:
        try:
            line = click.prompt(f"{cli_name.split('-')[-1]}", prompt_suffix="> ")
            line = line.strip()
            if not line:
                continue
            
            if line.lower() in ['exit', 'quit', 'q']:
                click.echo("Goodbye! 👋")
                break
            
            if line.lower() in ['help', '?']:
                main(['--help'])
                continue
            
            # Split into args
            import shlex
            args = shlex.split(line)
            try:
                main(args)
            except SystemExit:
                # Click calls sys.exit, just continue
                pass
            
        except KeyboardInterrupt:
            click.echo("\nKeyboard interrupt. Type exit to quit.")
        except EOFError:
            click.echo("\nGoodbye! 👋")
            break
        except Exception as e:
            click.secho(f"Error: {e}", fg="red")
    
    sys.exit(0)
