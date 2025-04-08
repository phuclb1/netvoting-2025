import inspect
from typing import Callable, Dict, List, Any, Mapping, Type

from inspect import Parameter, Signature
from collections import OrderedDict

ArgType = Type[object]
SigParameters = Mapping[str, Parameter]


class KeyMaker:
    def make(self, function: Callable, prefix: str,  *args: List, **kwargs: Dict) -> str:
        path = f"{prefix}::{inspect.getmodule(function).__name__}.{function.__name__}"
        sig = inspect.signature(function)
        sig_params = sig.parameters
        func_args = self.get_func_args(sig, *args, **kwargs)
        args_str = self.get_args_str(sig_params, func_args)
        return f"{path}.{args_str}"

    def get_func_args(self, sig: Signature, *args: List, **kwargs: Dict) -> "OrderedDict[str, Any]":
        """Return a dict object containing the name and value of 
        all function arguments."""
        func_args = sig.bind(*args, **kwargs)
        func_args.apply_defaults()
        return func_args.arguments

    def get_args_str(self, sig_params: SigParameters, func_args: "OrderedDict[str, Any]") -> str:
        """Return a string with the name and value of all 
        args whose type is not included in `ignore_arg_types`"""
        keys_arr = []
        for arg, val in func_args.items():
            if str(sig_params[arg]) == 'self':
                continue
            keys_arr.append(f'{arg}={val}')
        return ",".join(keys_arr)
