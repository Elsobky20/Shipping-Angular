import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GovernmentService } from '../../services/goverbment.service';
import { Government } from '../../Interfaces/government.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-government-list',
  templateUrl: './government-list.component.html',
  styleUrl: './government-list.component.css',
  imports: [CommonModule, FormsModule],
})
export class GovernmentListComponent implements OnInit {
  governments: Government[] = [];
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  constructor(
    private governmentService: GovernmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGovernments();
  }

  loadGovernments() {
    this.governmentService.getAll(this.pageIndex, this.pageSize).subscribe((res) => {
      this.governments = res.governments || res.Governments;
      this.totalCount = res.totalCount || 0;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    });
  }

  nextPage() {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.loadGovernments();
    }
  }

  previousPage() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.loadGovernments();
    }
  }

  onEdit(id: number) {
    this.router.navigate(['/governments/edit', id]);
  }

  onDelete(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه المحافظة؟')) {
      this.governmentService.delete(id).subscribe(() => this.loadGovernments());
    }
  }

  onAdd() {
    this.router.navigate(['/governments/add']);
  }
}
