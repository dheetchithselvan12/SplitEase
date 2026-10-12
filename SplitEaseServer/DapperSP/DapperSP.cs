using System.Data;
using Dapper;
using MySqlConnector;

namespace SplitEase.DapperSP;

public class 
    DapperSP : IDapperSP
{
    private readonly string _connectionString;

    public DapperSP(IConfiguration configuration)
    {
        _connectionString =
            configuration.GetConnectionString(
                "DefaultConnection"
            )!;
    }



    // SELECT MANY


    public async Task<IEnumerable<T>> QueryAsync<T>(
        string procedureName,
        object? parameters = null)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        return await connection.QueryAsync<T>(
            procedureName,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }



    // SELECT ONE


    public async Task<T?> QueryFirstOrDefaultAsync<T>(
        string procedureName,
        object? parameters = null)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        return await connection.QueryFirstOrDefaultAsync<T>(
            procedureName,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }



    // INSERT / UPDATE / DELETE


    public async Task<int> ExecuteAsync(
        string procedureName,
        object? parameters = null)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        return await connection.ExecuteAsync(
            procedureName,
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }



    // TWO RESULT SETS


    public async Task<(List<T1> First, List<T2> Second)>
        QueryMultipleAsync<T1, T2>(
            string procedureName,
            object? parameters = null)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        using var multi =
            await connection.QueryMultipleAsync(
                procedureName,
                parameters,
                commandType: CommandType.StoredProcedure
            );

        var first =
            (await multi.ReadAsync<T1>())
            .ToList();

        var second =
            (await multi.ReadAsync<T2>())
            .ToList();

        return (first, second);
    }



    // THREE RESULT SETS


    public async Task<
        (List<T1> First,
         List<T2> Second,
         List<T3> Third)>
        QueryMultipleAsync<T1, T2, T3>(
            string procedureName,
            object? parameters = null)
    {
        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        using var multi =
            await connection.QueryMultipleAsync(
                procedureName,
                parameters,
                commandType: CommandType.StoredProcedure
            );

        var first =
            (await multi.ReadAsync<T1>())
            .ToList();

        var second =
            (await multi.ReadAsync<T2>())
            .ToList();

        var third =
            (await multi.ReadAsync<T3>())
            .ToList();

        return (first, second, third);
    }
}