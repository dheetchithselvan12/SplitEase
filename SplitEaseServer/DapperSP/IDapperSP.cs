namespace SplitEase.DapperSP;

public interface IDapperSP
{
    Task<IEnumerable<T>> QueryAsync<T>(
        string procedureName,
        object? parameters = null
    );

    Task<T?> QueryFirstOrDefaultAsync<T>(
        string procedureName,
        object? parameters = null
    );

    Task<int> ExecuteAsync(
        string procedureName,
        object? parameters = null
    );

    Task<(List<T1> First, List<T2> Second)>
        QueryMultipleAsync<T1, T2>(
            string procedureName,
            object? parameters = null
        );

    Task<(List<T1> First, List<T2> Second, List<T3> Third)>
        QueryMultipleAsync<T1, T2, T3>(
            string procedureName,
            object? parameters = null
        );
}