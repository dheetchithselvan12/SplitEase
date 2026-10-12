using System.Text.Json.Nodes;
using Newtonsoft.Json.Linq;
using SplitEase.Utils;

namespace SplitEase.Services.ExpenseService;

public interface IExpenseService
{
    Task<CustomResponse> ViewInit(int groupId);
    Task<CustomResponse> Create(JObject obj);
}