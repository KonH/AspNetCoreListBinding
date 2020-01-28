using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AspNetCoreListBinding.ViewModels {
	public sealed class IndexViewModel {
		[Required]
		public List<IndexEntry> Values { get; set; }
	}
}