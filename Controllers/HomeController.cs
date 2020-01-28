using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AspNetCoreListBinding.ViewModels;

namespace AspNetCoreListBinding.Controllers {
	public class HomeController : Controller {
		private readonly ILogger<HomeController> _logger;

		public HomeController(ILogger<HomeController> logger) {
			_logger = logger;
		}

		[HttpGet]
		public IActionResult Index() {
			var values = new List<IndexEntry> {
				new IndexEntry {
					Value = "Value"
				}
			};
			return View(new IndexViewModel {
				Values = values
			});
		}

		[HttpPost]
		public IActionResult Index(IndexViewModel viewModel) {
			if ( !ModelState.IsValid ) {
				_logger.LogWarning("Model state is invalid");
				return View(viewModel);
			}
			_logger.LogInformation($"Values.Count: {viewModel.Values.Count}");
			foreach ( var value in viewModel.Values ) {
				_logger.LogInformation($"'{value.Value}'");
			}
			return View(viewModel);
		}

		public IActionResult Privacy() {
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error() {
			return View(new ErrorViewModel {RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier});
		}
	}
}