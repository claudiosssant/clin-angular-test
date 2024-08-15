import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClincDTO } from 'src/app/dtos/clinc.dto';
import { RoutesEnum } from 'src/app/enums/routes.enum';
import { ClincService } from 'src/app/services/clinc.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss'],
})
export class PageListComponent implements OnInit {

  clinics: ClincDTO[] = [];
  clinicForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clincService: ClincService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.clinicForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      ownerName: ['', Validators.required],
      cep: ['', Validators.required],
      uf: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      city: ['', Validators.required],
      neighborhood: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
    });
  }

  ngOnInit(): void {
    this.loadClinics();
  }

  private loadClinics(): void {
    this.clincService.getAllClincs().subscribe({
      next: (clinics: ClincDTO[]) => {
        this.clinics = clinics;
      },
      error: (err: any) => {
        console.error('Erro ao buscar dados:', err);
        this.toastService.showError('Erro ao resgatar listagem de clínicas');
      },
    });
  }

  createClincPage(): void {
    this.router.navigate([RoutesEnum.SESSION_NEW_CLINC]);
    if (this.clinicForm.invalid) {
      this.toastService.showError('Preencha todos os campos obrigatórios.');
      return;
    }
  }

  editPage(clincId: any): void {
    
    this.router.navigate([`${RoutesEnum.SESSION_CLINC_INFO}/${clincId}`]);
  }

  delete(clincId: any): void {

    this.clincService.deleteClinc(clincId).subscribe({
      next: () => {
        this.toastService.showSuccess('Clínica deletada com sucesso!');
        this.loadClinics();
      },
      error: (err: any) => {
        console.error('Erro ao deletar clínica:', err);
        this.toastService.showError('Erro ao deletar clínica');
      },
    });
  }
}
