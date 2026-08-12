import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DropFlyway {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require";
        String user = "postgres.lwqaoytnyuqocmjmxbin";
        String pass = "Mylife@2k597";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {

            System.out.println("Connected to database!");

            // Check tables
            ResultSet rs = stmt.executeQuery("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
            System.out.println("Tables in public schema:");
            while(rs.next()) {
                System.out.println(" - " + rs.getString(1));
            }

            System.out.println("Dropping flyway_schema_history...");
            stmt.execute("DROP TABLE IF EXISTS flyway_schema_history CASCADE");
            System.out.println("flyway_schema_history dropped successfully.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
