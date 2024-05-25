using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;
    public class Model
    {
        [Key]
        public string ModelName { get; set; } = null!;
    }
